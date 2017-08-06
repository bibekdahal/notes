let ipc = require('electron').ipcRenderer;

let selectedTab;


function save() {
    let data = {
        tabs: [],
        lastSelected: selectedTab,
    };

    $('#tabs .tab').each(function() {
        let index = $('#tabs .tab').index($(this));
        selectTab(index);
        let tabData = {
            title: $('#tab-headers .tab-header').eq(index).find('.title').html(),
            notes: [],
        };
        $(this).find('.editor').each(function() {
            let text = $(this).find('.text-holder');
            tabData.notes.push({
                xPos: text.offset().left,
                yPos: text.offset().top,
                text: text.html(),
            });
        });

        data.tabs.push(tabData);
    });
    selectTab(data.lastSelected);

    ipc.send('save', JSON.stringify(data));
}

ipc.on('load', (event, data) => {
    try {
        data = JSON.parse(data);
        for (let i=0; i<data.tabs.length; i++) {
            let tabData = data.tabs[i];
            addTab(tabData.title);

            for (let j=0; j<tabData.notes.length; j++) {
                let note = tabData.notes[j];
                addNote(note.xPos, note.yPos, note.text);
            }
        }
        if (data.lastSelected) {
            selectTab(data.lastSelected);
        }
    } catch (error) {}

    if ($('#tabs .tab').length == 0) {
        addTab();
    }

    $('.text-holder').blur();
});


function addNote(xPos, yPos, text='') {
    let editor = $('<div class="editor"></div>');
    editor.append($('<div class="handle fa fa-arrows"></div>'))
    editor.append($('<div class="text-holder" tabIndex="1"></div>'));

    editor.appendTo($('#tabs .tab').eq(selectedTab));
    editor.css('left', xPos);
    editor.css('top', yPos);

    editor.draggable({
        grid: [8, 8],
        handle: '.handle',
        stop: function() { save(); },
    })

    makeEditable(editor.find('.text-holder'));
    editor.find('.text-holder').trigger('click');
    editor.find('.text-holder').html(text);

    editor.find('.text-holder').on('input keydown drop paste', function() {
        save();
    });
}

function makeEditable(element, dblClick=false) {
    element.on(dblClick?'dblclick':'click', function() {
        $(this).attr('contentEditable', 'true');
        $(this).focus();
    });

    element.blur(function() {
        $(this).attr('contentEditable', 'false');
        if ($(this).text().trim().length == 0) {
            $(this).closest('.editor').remove();
        }
    });

    element.on('keyup', function(e) {
        if (e.keyCode == 27) {
            element.blur();
        }
    })
}

function selectTab(index) {
    selectedTab = index;
    $('#tabs .tab').hide();
    $('#tab-headers .tab-header').removeClass('active');
    $('#tabs .tab').eq(index).show();
    $('#tab-headers .tab-header').eq(index).addClass('active');
}

function addTab(title='Untitled') {
    let newTab = $('<div class="tab"></div>');
    newTab.appendTo($('#tabs'));
    newTab.click(function(e) {
        if ($(e.target).hasClass('editor') || $(e.target).closest('.editor').length > 0) {
            return;
        }

        let xPos = e.pageX - $(this).offset().left;
        let yPos = e.pageY - $(this).offset().top;

        xPos = Math.ceil(xPos/20)*20-20;
        yPos = Math.ceil(yPos/20)*20-20;

        addNote(xPos, yPos);
        save();
    });

    let header = $('<div class="tab-header"><span class="title"></span><button class="delete-tab fa fa-trash-o"></button></div>');
    header.appendTo($('#tab-headers'));
    header.find('.title').html(title);
    header.click(function() {
        selectTab($('#tab-headers .tab-header').index(header));
        save();
    });

    makeEditable(header.find('.title'), true);
    header.find('.title').on('input keydown drop paste', function() {
        save();
    });

    header.find('.delete-tab').click(function() {
        if (confirm('Are you sure to you want to delete this tab?')) {
            header.remove();
            newTab.remove();

            if ($('#tabs .tab').length == 0) {
                addTab();
            }
            selectTab(0);
            save();
        }
    });

    selectTab($('#tabs .tab').length - 1);
}

$(document).ready(function() {
    $('#add-tab').click(function() {
        addTab();
    });
    // addTab('Notes 1');
    // addTab('Notes 2');
});
